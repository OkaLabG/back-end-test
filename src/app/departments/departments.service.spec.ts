import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AppError } from '../../helpers/Error';
import { AppResponse } from '../../helpers/Response';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

const departments: Department[] = [new Department({ name: 'Financeiro' })];

describe('DepartmentsService', () => {
  let departmentsService: DepartmentsService;
  let departmentRepository: MongoRepository<Department>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: {
            find: jest.fn().mockResolvedValue(departments),
            save: jest.fn(),
            findOne: jest
              .fn()
              .mockResolvedValue(
                new Department({ name: 'Financeiro', _id: 'teste' }),
              ),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    departmentRepository = module.get<MongoRepository<Department>>(
      getRepositoryToken(Department),
    );
  });

  it('should be defined', () => {
    expect(departmentsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should be able list all departments', async () => {
      const data = await departmentsService.findAll();

      expect(data).toEqual(
        new AppResponse({
          result: 'success',
          message: 'Success on list all departments',
          data: departments,
        }),
      );
    });

    it('should not be able return a empty value', async () => {
      jest.spyOn(departmentRepository, 'find').mockResolvedValueOnce([]);

      await expect(departmentsService.findAll()).rejects.toEqual(
        new AppError({
          result: 'error',
          message: 'Departments not found',
          statusCode: 400,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should be able list a department by id', async () => {
      const data = await departmentsService.findOne('teste');

      expect(data).toEqual(
        new AppResponse({
          result: 'success',
          message: 'Success on list this department',
          data: {
            _id: 'teste',
            createdAt: undefined,
            name: 'Financeiro',
          },
        }),
      );
    });

    it('should not be able return a empty value', async () => {
      jest.spyOn(departmentRepository, 'findOne').mockRejectedValueOnce(
        new AppError({
          result: 'error',
          message: 'Department not found',
          statusCode: 400,
        }),
      );

      await expect(departmentsService.findOne('abc')).rejects.toEqual(
        new AppError({
          result: 'error',
          message: 'Department not found',
          statusCode: 400,
        }),
      );
    });
  });
});
