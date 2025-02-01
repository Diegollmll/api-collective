import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

async function main() {
    // Seeders para Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
            name: 'Admin',
        },
    });

    await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: {
            name: 'User',
        },
    });

    await prisma.role.upsert({
        where: { name: 'Member' },
        update: {},
        create: {
            name: 'Member',
        },
    });

    await prisma.role.upsert({
        where: { name: 'Leader' },
        update: {},
        create: {
            name: 'Leader',
        },
    });

    const user1Password = await bcrypt.hash('asdasdasd', 10);

    // Seeders para Usuarios
    const user1 = await prisma.user.upsert({
        where: { email: 'asd@gmail.com' },
        update: {},
        create: {
            name: 'Usuario 1',
            email: 'asd@gmail.com',
            password: user1Password,
            roleId: adminRole.id,
            avatar: '',
        },
    });

    // Seeders para Proyectos
    await prisma.project.upsert({
        where: { slug: 'cococu-fundation' },
        update: {},
        create: {
            title: 'Cococu Fundation',
            description: 'Building Sustainably for Colombian Communities through Cultural tourism.',
            slug: 'cococu-fundation',
            image: '/projects/cococufundation.png',
            website: 'https://fundacioncococu.com',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '15%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'cococu-restaurant' },
        update: {},
        create: {
            title: 'Ibague Coffee Shop, restaurant, Hostel',
            description: 'Opening the coffee shop, finalising the restaurant and the Hostel.',
            slug: 'cococu-restaurant',
            image: '/projects/restaurant.png',
            website: 'https://restaurantcococu.com/',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '45%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'driverxq' },
        update: {},
        create: {
            title: 'Driver XQ',
            description: 'Helping users to achieve their goals and improve their lives.',
            slug: 'driverxq',
            image: '/projects/driver.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: 'Not defined',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'subseven' },
        update: {},
        create: {
            title: 'Sub 7',
            description: 'Sell CIG products under a CA license. It will be a new company.',
            slug: 'subseven',
            image: '/projects/sub7.png',
            website: 'https://sub7.vercel.app/',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '10%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'junta-education' },
        update: {},
        create: {
            title: 'Junta education and transparency',
            description: 'This is the beginning of a strategy to engage Farmers to be sustainable. Specifically starting in the Canyon and linking to the Juntas.',
            slug: 'junta-education',
            image: '/projects/junta-education.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '10%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'bus-project' },
        update: {},
        create: {
            title: 'Bus project',
            description: 'Colombian Mapper is an app designed to transform and improve the public transportation experience in Colombia, specifically focusing on bus services.',
            slug: 'bus-project',
            image: '/projects/bus.jpg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '70%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'ulock' },
        update: {},
        create: {
            title: 'Ulock',
            description: 'Security system to store things, this through a web application.',
            slug: 'ulock',
            image: '/projects/ulock.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '60%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'uvision' },
        update: {},
        create: {
            title: 'Uvision',
            description: 'Camera system for monitoring and recognition through subscription.',
            slug: 'uvision',
            image: '/projects/uvision.svg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '20%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'the-presence' },
        update: {},
        create: {
            title: 'The presence',
            description: 'This project is developing a presence in Ibagué that It will give the city a purpose, attract tourists and generate employment.',
            slug: 'the-presence',
            image: '/projects/the_presence.svg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '10%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'marketing-project' },
        update: {},
        create: {
            title: 'Marketing Project',
            description: 'Una agencia de marketing en la cual buscamos posicionar a nuestros clientes en el mercado actual ofreciendo soluciones tanto en el campo tecnológico, visuales y marketing.',
            slug: 'marketing-project',
            image: '/projects/marketing-project.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '35%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'udata' },
        update: {},
        create: {
            title: 'Udata',
            description: 'Personalized data systems.',
            slug: 'udata',
            image: '/projects/udata.svg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '15%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'service-package' },
        update: {},
        create: {
            title: 'Service Package',
            description: 'In this space we will work on the needs of our clients, making them fall in love with the Service Packages, helping them to make informed decisions and improve their quality of life with our service.',
            slug: 'service-package',
            image: '/projects/service.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: 'Not defined',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'grapes-and-wine' },
        update: {},
        create: {
            title: 'Grapes and Wines',
            description: 'Alliance with Wines and Grapes. Uvas y vino Colombia S.A” has as its main objective to improve the financial capacity of the wine factory during the projected five years.',
            slug: 'grapes-and-wine',
            image: '/projects/wines.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '5%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'unreal-project' },
        update: {},
        create: {
            title: 'Unreal project',
            description: 'Web application for the training of new interns at Collective Intelligence Group.',
            slug: 'unreal-project',
            image: '/projects/unreal.svg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '5%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'founding-families' },
        update: {},
        create: {
            title: 'Founding Families',
            description: 'A project that can leave a lasting positive legacy in our city, and potentially, across the entire country. I envision a future where your name is associated with overwhelming positivity.',
            slug: 'founding-families',
            image: '/projects/founding_families.svg',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '0%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'life' },
        update: {},
        create: {
            title: 'Life',
            description: 'Mujeres motociclistas.',
            slug: 'life',
            image: '/projects/life.png',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '0%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'e-helpdesk' },
        update: {},
        create: {
            title: 'E-helpdesk',
            description: 'E-helpdesk system. A space to report bugs, improvements, feedback... that will make it the best ally in troubleshooting for the Customer and the global support team.',
            slug: 'e-helpdesk',
            image: '',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '33%',
        },
    });

    await prisma.project.upsert({
        where: { slug: 'automation-of-reports' },
        update: {},
        create: {
            title: 'Automation of Reports',
            description: 'The objective of this project is to create a system that generates automatic reports for any company. Customized to the specific needs of the client.',
            slug: 'automation-of-reports',
            image: '',
            website: '',
            leaderId: user1.id,
            requirements: 'Undefined',
            progress: '65%',
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .then(() => {
        console.log('Seeding completed.');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
