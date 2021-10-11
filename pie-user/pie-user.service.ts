import {
  BadRequestException,
  InternalServerErrorException,
  Injectable
} from '@nestjs/common';
import { fetchAllPieUsers } from './constants/cache.constant';
import { getConnection } from 'typeorm';
import { CoreOutput } from 'sm-interfaces';
import { PieUser } from './entities/pie-user.entity';
import { client } from '../main';
import {
  PG_UNIQUE_CONSTRAINT_VIOLATION,
  PG_VIOLATES_FK_CONSTRAINT,
  SomethingWentWrong,
  SomethingWentWrongCode,
  UnableToCreate,
  UnableToCreateCode,
  UnableToDeleteParticular,
  UnableToDeleteParticularCode,
  UnableToFindAny,
  UnableToFindAnyCode,
  UnableToFindParticularContent,
  UnableToFindParticularContentCode,
  UnableToUpdateParticular,
  UnableToUpdateParticularCode
} from 'sm-errors';
import {
  CreateSuccessful,
  DeleteSuccessful,
  UpdateSuccessful
} from 'sm-messages';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PieUserService {
  constructor() {}

  async fetchAllPieUser() {
    try {
      const cache = await client.get(fetchAllPieUsers);
      if (cache) return JSON.parse(cache);
    } catch (error) {
      await client.del(fetchAllPieUsers);
    }

    const route = 'Pie User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.find<PieUser>(PieUser);

      await client.set(fetchAllPieUsers, JSON.stringify(result));

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        ok: false,
        error: true,
        message: SomethingWentWrong,
        code: SomethingWentWrongCode
      });
    } finally {
      await queryRunner.release();
    }
  }

  async createPieUser(
    { Rafiale, empNo, bobby, sammy },
    pieUserPayload
  ): Promise<CoreOutput> {
    const route = 'Pie User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pieUser = new PieUser();

      pieUser.Rafiale = Rafiale;
      pieUser.empNo = empNo;
      pieUser.bobby = bobby;
      pieUser.sammy = sammy;
      pieUser.createdBy = pieUserPayload.empNo;
      pieUser.updatedBy = pieUserPayload.empNo;

      const result = await queryRunner.manager.save<PieUser>(pieUser);

      if (!result) {
        return {
          ok: false,
          error: true,
          message: UnableToCreate(route),
          code: UnableToCreateCode
        };
      }

      await client.del(fetchAllPieUsers);

      return {
        ok: true,
        error: false,
        message: CreateSuccessful(route)
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }

      if (error && error.code === PG_VIOLATES_FK_CONSTRAINT) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }

      throw new InternalServerErrorException({
        ok: false,
        error: true,
        code: SomethingWentWrongCode,
        message: SomethingWentWrong
      });
    } finally {
      await queryRunner.release();
    }
  }

  async updatePieUser({ id, Rafiale, empNo, bobby, sammy }, pieUserPayload) {
    const route = 'Pie User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pieUser = new PieUser();

      pieUser.id = id;
      if (Rafiale) pieUser.Rafiale = Rafiale;
      if (empNo) pieUser.empNo = empNo;
      if (bobby) pieUser.bobby = bobby;
      if (sammy) pieUser.sammy = sammy;
      pieUser.updatedBy = pieUserPayload.empNo;

      const result = await queryRunner.manager.update<PieUser>(
        PieUser,
        { id },
        pieUser
      );

      if (result.affected === 0) {
        return {
          ok: false,
          error: true,
          message: UnableToUpdateParticular(route),
          code: UnableToUpdateParticularCode
        };
      }

      await queryRunner.commitTransaction();

      await client.del(fetchAllPieUsers);

      return {
        ok: true,
        error: false,
        message: UpdateSuccessful(route)
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }

      if (error && error.code === PG_VIOLATES_FK_CONSTRAINT) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }

      throw new InternalServerErrorException({
        ok: false,
        error: true,
        code: SomethingWentWrongCode,
        message: SomethingWentWrong
      });
    } finally {
      await queryRunner.release();
    }
  }

  async deletePieUser({ id }, pieUserPayload) {
    const route = 'Pie User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.delete<PieUser>(PieUser, {
        id
      });

      await queryRunner.commitTransaction();

      if (result.affected === 0) {
        return {
          ok: false,
          error: true,
          message: UnableToDeleteParticular(route),
          code: UnableToDeleteParticularCode
        };
      }

      await client.del(fetchAllPieUsers);

      return {
        ok: true,
        error: false,
        message: DeleteSuccessful(route)
      };
    } catch {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException({
        ok: false,
        error: true,
        code: SomethingWentWrongCode,
        message: SomethingWentWrong
      });
    } finally {
      await queryRunner.release();
    }
  }

  async verifyJWT(token: string) {
    try {
      const PRIVATE_KEY = JSON.parse(`"${process.env.PRIVATE_KEY}"`);
      const PUBLIC_KEY = JSON.parse(`"${process.env.PUBLIC_KEY}"`);

      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS512']
      });

      return decoded;
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('jwt expired')
      };
    }
  }
}
