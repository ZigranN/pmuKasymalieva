import Master from '../models/Master.js';
import {deleteImage} from '../services/cloudinaryService.js';

export const getAllMasters = async (req, res) => {
    try {
        const masters = await Master.find()
            .populate('services', 'name')
            .exec();
        res.status(200).json(masters);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при загрузке мастеров' });
    }
};

export const createMaster = async (req, res) => {
    try {
        const { name, email, phoneNumber, services } = req.body;
        const parsedServices = Array.isArray(services) ? services.map(String) : [String(services)];
        const photoUrl = req.file ? req.file.path : null;

        const newMaster = new Master({
            name,
            email,
            phoneNumber,
            photoUrl,
            services: parsedServices,
        });

        await newMaster.save();
        res.status(201).json({
            message: 'Мастер успешно создан',
            data: newMaster
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании мастера' });
    }
};

export const updateMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber } = req.body;

        const master = await Master.findById(id);
        if (!master) {
            return res.status(404).json({ error: 'Мастер не найден' });
        }

        if (req.file) {
            if (master.photoUrl) {
                await deleteImage(master.photoUrl);
            }
            master.photoUrl = req.file.path;
        }

        if (name && name !== master.name) master.name = name;
        if (email && email !== master.email) master.email = email;
        if (phoneNumber && phoneNumber !== master.phoneNumber) master.phoneNumber = phoneNumber;

        if (req.body['services']) {
            const servicesArray = Array.isArray(req.body['services'])
                ? req.body['services']
                : [req.body['services']];
            master.services = servicesArray;
        }

        await master.save();
        res.status(200).json(master);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении мастера' });
    }
};

export const deleteMaster = async (req, res) => {
    try {
        const { id } = req.params;

        const master = await Master.findById(id);
        if (!master) {
            return res.status(404).json({ error: 'Мастер не найден' });
        }

        if (master.photoUrl) {
            await deleteImage(master.photoUrl);
        }
        await master.deleteOne({ _id: id });

        res.status(200).json({ message: 'Мастер успешно удалён' });

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении мастера' });
    }
};
