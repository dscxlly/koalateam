import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, koala } from "@prisma/client";
import cors from '@fastify/cors';
import { request } from 'http';

const prisma = new PrismaClient();
const app = Fastify();
app.register(cors, {
    origin: "*",
});

app.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, name, age, description, diet, extinct, vacinated } = request.body as koala;
    const koala = await prisma.koala.create({
        data: {
            id,
            name,
            age,
            description,
            diet,
            extinct,
            vacinated
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

/*app.listen({ port: 3333 });
console.log('Online')*/
