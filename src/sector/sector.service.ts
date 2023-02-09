import { Injectable } from '@nestjs/common';
import { AppResponse } from 'src/helper/response';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Sector } from './entities/sector.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: MongoRepository<Sector>,
  ) {}

  async create({
    description,
    responsible,
  }: CreateSectorDto): Promise<AppResponse> {
    const createSector = new Sector();

    createSector._id = uuidv4();
    createSector.created_at = new Date();
    createSector.description = description;
    createSector.responsible = responsible;

    const sector = await this.sectorRepository.save(createSector);

    return new AppResponse({
      message: 'Setor criado com sucesso',
      result: 'success',
      data: {
        id: sector._id,
        description: sector.description,
        responsible: sector.responsible,
      },
    });
  }

  async findAll(): Promise<AppResponse> {
    const sectors = await this.sectorRepository.find();

    const newSectors = sectors.map((sector) => ({
      id: sector._id,
      description: sector.description,
      responsible: sector.responsible,
    }));

    return new AppResponse({
      message: 'Setores listados com sucesso!',
      result: 'success',
      data: newSectors,
    });
  }

  async findOne(id: string): Promise<AppResponse> {
    const sector = await this.sectorRepository.findOneBy({ _id: id });

    if (!sector) {
      throw new AppResponse({
        message: 'Setor não encontrado!',
        result: 'success',
        statusCode: 400,
      });
    }

    return new AppResponse({
      message: 'Setor encontrado com sucesso!',
      result: 'success',
      data: {
        id: sector._id,
        description: sector.description,
        responsible: sector.responsible,
      },
    });
  }

  async update(id: string, { description, responsible }: UpdateSectorDto) {
    const listSector = await this.sectorRepository.findOneBy({ _id: id });

    if (!listSector) {
      throw new AppResponse({
        message: 'Setor não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    const sector = new Sector();

    sector.description = description;
    sector.responsible = responsible;

    await this.sectorRepository.updateOne(listSector, {
      $set: sector,
    });

    return new AppResponse({
      message: 'Setor atualizado com sucesso!',
      result: 'success',
    });
  }

  async remove(id: string): Promise<AppResponse> {
    const listSector = await this.sectorRepository.findOneBy({ _id: id });

    if (!listSector) {
      throw new AppResponse({
        message: 'Setor não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    await this.sectorRepository.deleteOne(listSector);

    return new AppResponse({
      message: 'Setor deletado com sucesso!',
      result: 'success',
    });
  }
}
