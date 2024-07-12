import { FastifyInstance } from "fastify"
import { ClientError } from "./client-erro"
import { ZodError } from "zod"

type FastifyErrorHandler = FastifyInstance['errorHandler']


export const errorHandler: FastifyErrorHandler = (error, request, response) => {

    if (error instanceof ZodError) {
        return response.status(400).send({
            message: 'Invalid Input',
            code: 400,
            errors: error.flatten().fieldErrors
        })
    }


    if (error instanceof ClientError) {
        return response.status(404).send({
            message: error.message,
            code: 404
        })
    }

}