import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { Prisma, PrismaClient } from "@prisma/client";
import { koala } from "@prisma/client";
import cors from '@fastify/cors';
import { request } from 'http';

const prisma = new PrismaClient();
const app = Fastify();
app.register(cors, {
    origin: "*",
});

app.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, name, age, description, diet, extinct, vaccinated } = request.body as koala;
    const koala = await prisma.koala.create({
        data: {
            id,
            name,
            age,
            description,
            diet,
            extinct,
            vaccinated
        },
    });
    reply.send('Koala created')
});


app.get('/koalas', async (request: FastifyRequest, reply: FastifyReply) => {
    const koalas = await prisma.koala.findMany();
    reply.send(koalas)
})

app.get('/koalas/search', async (request: FastifyRequest, reply: FastifyReply) => {
    const { query } = request.query as { query: string };
    try {
        const koalas = await prisma.koala.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { diet: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        reply.send(koalas);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.put('/koalas/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };
    const koalaData = request.body as Prisma.koalaUpdateInput;;

    try {
        const updatedKoala = await prisma.koala.updateMany({
            where: { name: name },
            data: koalaData, 
        });

        reply.send('Koala updated!')
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.delete('/koalas/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };

    try {
        const deletedKoala = await prisma.koala.deleteMany({
            where: { name: name },
        });

        reply.send('Koala deleted.')

    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

const start = async () => {
    try {
        await app.listen({ port: 3333 });
        console.log('Server listening at http://localhost:3333');
    } catch (error) {
        console.error('Something went wrong.');
        process.exit(1);
    }
};

start();
