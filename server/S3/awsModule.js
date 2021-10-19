import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  CopyObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import axios from 'axios';
import {
  badResponse,
  noCodeBadResponse,
  getErrorObject,
} from './s3ErrorHandlers.js';

// ============== S3 version 3 ================
let client;
const awsBucketName = process.env.awsBucketName;
// const awsBucketNameCors = 'testd94e5ad8-acff-4056-a5df-a8f3f5c09346';
// const awsBucketNameNoCors = 'test80125c37-c2fa-44c4-b364-28a07e82f25e';

// Cors configuration for a bucket
const corsConfig = [
  {
    AllowedHeaders: ['*'],
    AllowedMethods: ['PUT', 'POST', 'GET', 'DELETE'],
    AllowedOrigins: ['https://picskeep.herokuapp.com'],
    ExposeHeaders: [],
  },
];

/** Configures the S3 client*/
async function configureS3Client(bucketName = awsBucketName) {
  const config = {
    region: process.env.awsRegion,
    credentials: {
      accessKeyId: process.env.awsAccessID,
      secretAccessKey: process.env.awsSecretAccessKey,
    },
  };

  client = new S3Client(config);

  const command = new ListBucketsCommand({});

  try {
    const res = await client.send(command);

    if (res.$metadata.httpStatusCode === 200) {
      const bucketList = res.Buckets.map(bucket => bucket.Name);
      // console.log('Buckets in S3: ', bucketList);

      if (!bucketList.includes(bucketName)) {
        console.log('Bucket was not found in S3. Creating bucket');
        createNewBucket(bucketName, { publicAccess: false, cors: true });
      }
    } else {
      // throw err in config
      throw new Error(
        `ListBucketsCommand operation was not successful: with error code of ${res.$metadata.httpStatusCode}
        
        Metadata: ${res.$metadata}`
      );
    }
  } catch (err) {
    console.log('Error occured in configuring S3: ', err);
    throw err;
  }
}

async function blockPublicAccess(bucketName) {
  let resStatus;
  try {
    const command = new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
        IgnorePublicAcls: true,
      },
    });

    const res = await client.send(command);
    console.log('Block Public Access Response: ', res);
    resStatus = res.$metadata.httpStatusCode;

    if (resStatus === 200) {
      return { statusCode: 200 };
    } else {
      return badResponse('Block bucket public access failed', 500, resStatus);
    }
  } catch (err) {
    getErrorObject(
      'Error in blocking bucket public access',
      500,
      resStatus,
      err
    );
  }
}

/** Configures cors for a bucket
 *
 * @param {Array} corsConfig
 * @returns
 */
async function addCorsPolicy(bucketName, corsConfig) {
  let resStatus;
  try {
    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: { CORSRules: corsConfig },
    });

    const res = await client.send(command);
    console.log('Cors response: ', res);
    resStatus = res.$metadata.httpStatusCode;

    if (resStatus === 200) {
      return { statusCode: 200 };
    } else {
      return badResponse('CORS creation failed', 500, resStatus);
    }
  } catch (err) {
    return getErrorObject('Error in CORS Put', 500, resStatus, err);
  }
}

/** Creates a new S3 bucket
 * @param {String} bucketName name of the bucket
 * @param {Object} options options when creating bucket
 * @returns information on whether bucket was created or not
 */
async function createNewBucket(bucketName, { publicAccess, configureCors }) {
  console.log('Creating bucket: ', bucketName);
  let IAMUserIDs = process.env.awsIAMUserIDs.split(',').map(id => `id=${id}`);
  IAMUserIDs = IAMUserIDs.join(';');

  let createStatusCode;
  // console.log('IAMUSERIDS: ', IAMUserIDs);

  try {
    const command = new CreateBucketCommand({
      Bucket: bucketName.toLowerCase(),
      CreateBucketConfiguration: { LocationConstraint: process.env.awsRegion },
      // ACL: 'private',
      GrantRead: IAMUserIDs,
      GrantWrite: IAMUserIDs,
      GrantFullControl: IAMUserIDs,
      GrantReadACP: IAMUserIDs,
      GrantWriteACP: IAMUserIDs,
    });

    const res = await client.send(command);
    createStatusCode = res.$metadata.httpStatusCode;

    console.log('Create Bucket Response: ', res);
    if (createStatusCode === 200) {
      let corsStatus = false;
      let publicAccessStatus = false;

      if (!publicAccess) {
        let publicAccessStatusCode;

        try {
          publicAccessStatusCode = await blockPublicAccess(bucketName);
          console.log('Statu: ', publicAccessStatusCode);

          if (publicAccessStatusCode.statusCode === 200) {
            publicAccessStatus = true;
          } else {
            return badResponse(
              'Bucket was created but public access was not blocked',
              500,
              publicAccessStatusCode
            );
          }
        } catch (err) {
          return getErrorObject(
            'Error in blocking public access but bucket was created',
            500,
            publicAccessStatusCode,
            err
          );
        }
      }

      if (configureCors) {
        let corsStatusCode;
        try {
          const corsRes = await addCorsPolicy(bucketName, corsConfig);
          corsStatusCode = corsRes.statusCode;

          // console.log('Put Cors Response: ', corsRes);
          if (corsStatusCode === 200) {
            corsStatus = true;
          } else {
            return badResponse(
              'Bucket was created but CORS was not configured',
              500,
              corsStatusCode
            );
          }
        } catch (err) {
          return getErrorObject(
            'Bucket was created but error in cors configuration',
            500,
            corsStatusCode,
            err
          );
        }
      }

      return {
        statusCode: 200,
        publicAccess: publicAccessStatus,
        cors: corsStatus,
      };
    } else {
      return badResponse('Bucket was not created', 500, createStatusCode);
    }
  } catch (err) {
    return getErrorObject(
      'Error in creating bucket',
      500,
      createStatusCode,
      err
    );
  }
}

/** Closes the S3Client*/
export function closeS3Client() {
  if (client) {
    client.destroy();
  }
}

/** Returns the S3Client*/
export async function getS3Client() {
  if (!client) {
    await configureS3Client();
  }

  return client;
}

/** Creates a get presigned url
 * @param {String} key
 */
export async function getPresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: awsBucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  // console.log('Signed Url: ', signedUrl);
  return signedUrl;
}

/** Creates a put presigned url
 * @param {String} key
 */
export async function putPresignedUrl(key) {
  const command = new PutObjectCommand({
    Bucket: awsBucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log('Put Signed Url: ', signedUrl);
  const demoFilePath = 'C:/Users/Fego/Pictures/Wallpapers/352112.jpg';
  await putObject(signedUrl, demoFilePath);

  return signedUrl;
}

/** Copies an object
 * @param {String} sourceKey the key of the source
 * @param {String} destKey the key of the destination
 * @returns information about the operation
 */
export async function copyObject(oldKey, newKey) {
  let resStatus;

  try {
    const command = new CopyObjectCommand({
      Bucket: awsBucketName,
      CopySource: encodeURIComponent(`${awsBucketName}/${oldKey}`), //the source has to be urlEncoded
      Key: newKey,
    });

    const res = await client.send(command);
    console.log('Copy response: ', res);
    resStatus = res.$metadata.httpStatusCode;

    if (resStatus === 200) {
      return { statusCode: 200 };
    } else {
      return badResponse('Object was not copied', 500, resStatus);
    }
  } catch (err) {
    return getErrorObject('Error in object copy', 500, resStatus, err);
  }
}

/** Deletes an object
 * @param {String} key the key of the object to be deleted
 * @returns information about the operation
 */
export async function deleteObject(key) {
  let resStatus;
  try {
    const command = new DeleteObjectCommand({
      Bucket: awsBucketName,
      Key: key,
    });

    const res = await client.send(command);
    resStatus = res.$metadata.httpStatusCode;
    console.log('Delete response: ', res.$metadata);

    if (resStatus === 204) {
      return { statusCode: 200 };
    } else {
      return badResponse('Object was not deleted', 500, resStatus);
    }
  } catch (err) {
    return getErrorObject(
      'Error in single object deletion',
      500,
      resStatus,
      err
    );
  }
}

/** Deletes multiple objects
 * @param {String} key the key of the object to be deleted
 * @returns information about the operation
 */
export async function deleteMultipleObjects(keys) {
  let resStatus;
  if (keys.length) {
    // Change the structure of array to S3 required format
    const delObjects = keys.map(key => {
      console.log('Delete response: ', res.$metadata);
      return { key: key };
    });

    try {
      const command = new DeleteObjectsCommand({
        Bucket: awsBucketName,
        Delete: {
          Objects: delObjects,
        },
      });

      const res = await client.send(command);
      console.log('Delete response: ', res);
      resStatus = res.$metadata.httpStatusCode;

      if (resStatus === 204) {
        return { statusCode: 200 };
      } else {
        return badResponse('Object was not deleted', 500, resStatus);
      }
    } catch (err) {
      return getErrorObject(
        'Error in single object deletion',
        500,
        resStatus,
        err
      );
    }
  } else {
    return null;
  }
}

/** Lists all the objects in the bucket
 *
 * @returns Array of objects
 */
export async function listBucketObjects(bucketName = awsBucketName) {
  try {
    const objects = await client.send(
      new ListObjectsCommand({ Bucket: bucketName })
    );

    console.log('Objects in Bucket: ', objects);

    return objects.Contents;
  } catch (err) {
    return noCodeBadResponse('Error in reading the bucket objects', 500);
  }
}

/** Renames an object
 * @param {String} sourceKey the old key name
 * @param {String} destKey the new key name
 * @returns status code showing whether the operation was successful
 */
export async function renameObject(sourceKey, destKey) {
  const copyRes = await copyObject(sourceKey, destKey);

  if (copyRes.statusCode === 200) {
    const delRes = await deleteObject(sourceKey);

    if (delRes.statusCode === 200) {
      return { statusCode: 200 };
    } else {
      noCodeBadResponse('Object deletion failed', 500);
    }
  } else {
    noCodeBadResponse('Object copying failed', 500);
  }
}

export async function testAWSCommands() {
  // const oldKey = 'newfile.jpg';
  // const newKey = 'copiedfile.jpg';
  // await renameObject(oldKey, newKey);
  // await createNewBucket(`test${v4()}`);
  // await putPresignedUrl('newfile.jpg');
  // await addCorsPolicy(corsConfig);
  // await getPresignedUrl('newfile.jpg');
  // await listBucketObjects(awsBucketName);
  // await blockPublicAccess(awsBucketName);
}

async function putObject(url, filePath) {
  // Just testing the put url
  const file = fs.readFileSync(filePath);

  const res = await axios({
    url,
    method: 'put',
    data: file,
    'Content-Type': 'image/jpg',
  });

  console.log('Upload succesful? ', res.status);
}
