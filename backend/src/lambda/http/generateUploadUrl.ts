import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId } from "../utils";

const logger = createLogger('generateUploadUrl')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const todosTable = event.pathParameters.todoId
  const s3 = new AWS.S3({
     signatureVersion: 'v4' // Use Sigv4 algorithm
  })
  const presignedUrl = s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
     Bucket: 's3-bucket-name', // Name of an S3 bucket
     Key: 'object-id', // id of an object this URL allows access to
     Expires: '300'  // A URL is only valid for 5 minutes
  })


  const imageId = uuid.v4()


  const url = getUploadUrl(imageId)
  logger.info('Getting uploadUrl: ', url)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }}
