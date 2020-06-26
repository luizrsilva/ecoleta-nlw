import { Request, Response } from 'express';
import knex from '../database/connection';


class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));


        let knexQuery = knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id');

        if (parsedItems) {
            knexQuery = knexQuery.whereIn('point_items.item_id', parsedItems);
        }

        if (city) {
            knexQuery = knexQuery.where('city', String(city));
        }
        if (uf) {
            knexQuery = knexQuery.where('uf', String(uf));
        }
        const points = await knexQuery
            .distinct().select('points.*');

        const serializedPoints = points.map((point) => {
            return {
                ...points,
                image_url: `http://192.168.0.9:3030/uploads/${point.image}`
            }
        });
        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(404).json({ message: 'Point not found' })
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', point.id).select('items.title');


        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.9:3030/uploads/${point.image}`
        }


        return response.json({
            point: serializedPoint,
            items
        });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items } = request.body;

        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: request.file.filename
        }

        const trx = await knex.transaction();

        const [pointIdInserted] = await trx('points').insert({
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: request.file.filename
        });

        const pointItems = items
            .split(',')
            .map((x: string) => Number(x.trim()))
            .map((item: Number) => {
                return {
                    item_id: item,
                    point_id: pointIdInserted
                }
            });

        await trx('point_items').insert(pointItems);

        await trx.commit();
        return response.status(201).send({
            id: pointIdInserted,
            ...point,
        });
    }
}

export default PointsController;


