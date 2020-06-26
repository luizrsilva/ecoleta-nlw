import Knex from "knex";

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Lamps', image: 'lampadas.svg' },
        { title: 'Stacks & Batteries', image: 'Baterias.svg' },
        { title: 'Papers', image: 'papeis-papelao.svg' },
        { title: 'Electronic Waste        ', image: 'eletronicos.svg' },
        { title: 'Organic Waste', image: 'organicos.svg' },
        { title: 'Kitchen oil', image: 'oleo.svg' }
    ]);
};