import { PrismaClient } from "@prisma/client";
import { ClientError } from "../../handlers/errors/client-erro";


export type CreateLinkInput = {
    tripId: string
    title: string,
    url: string
}


export type CreateLinkOutput = {
    id: string
}

export class CreateLinkService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new CreateLinkService(repository);
    }
    public async create({ title, tripId, url }: CreateLinkInput): Promise<CreateLinkOutput> {

        const trip = await this.repository.trip.findUnique({ where: { id: tripId } });

        if (!trip) throw new ClientError('Trip not found.');

        const link = await this.repository.link.create({
            data: {
                title,
                url,
                trip_id: tripId
            }
        })

        const output: CreateLinkOutput = {
            id: link.id
        }

        return output;

    }


}

