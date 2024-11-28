import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.driver.create({
    data: {
      name: 'Homer Simpson',
      car: 'Plymouth Valiant 1973 rosa e enferrujado',
      description:
        'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      minDistance: 1000,
      rate: 2.5,
      comments: {
        create: {
          comment:
            'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
          score: 2,
        },
      },
    },
  });

  await prisma.driver.create({
    data: {
      name: 'Dominic Toretto',
      car: 'Dodge Charger R/T 1970 modificado',
      description:
        'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      minDistance: 5000,
      rate: 5,
      comments: {
        create: {
          comment:
            'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
          score: 4,
        },
      },
    },
  });

  await prisma.driver.create({
    data: {
      name: 'James Bond',
      car: 'Aston Martin DB5 clássico',
      description:
        'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      minDistance: 10000,
      rate: 10,
      comments: {
        create: {
          comment:
            'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
          score: 5,
        },
      },
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
