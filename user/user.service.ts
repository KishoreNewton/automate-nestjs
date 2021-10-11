import {
  BadRequestException,
  InternalServerErrorException,
  Injectable
} from '@nestjs/common';
import { fetchAllUsers } from './constants/cache.constant';
import { getConnection } from 'typeorm';
import { CoreOutput } from 'sm-interfaces';
import { User } from './entities/user.entity';
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
export class UserService {
  constructor() {}

  async fetchAllUser() {
    try {
      const cache = await client.get(fetchAllUsers);
      if (cache) return JSON.parse(cache);
    } catch (error) {
      await client.del(fetchAllUsers);
    }

    const route = 'User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.find<User>(User);

      await client.set(fetchAllUsers, JSON.stringify(result));

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

  async createUser(
    { dean, cass, bobby, sammy },
    pieUserPayload
  ): Promise<CoreOutput> {
    const route = 'User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new User();

      user.dean = dean;
      user.cass = cass;
      user.bobby = bobby;
      user.sammy = sammy;
      user.createdBy = pieUserPayload.empNo;
      user.updatedBy = pieUserPayload.empNo;

      const result = await queryRunner.manager.save<User>(user);

      if (!result) {
        return {
          ok: false,
          error: true,
          message: UnableToCreate(route),
          code: UnableToCreateCode
        };
      }

      await client.del(fetchAllUsers);

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

  async updateUser({ id, dean, cass, bobby, sammy }, pieUserPayload) {
    const route = 'User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new User();

      user.id = id;
      if (dean) user.dean = dean;
      if (cass) user.cass = cass;
      if (bobby) user.bobby = bobby;
      if (sammy) user.sammy = sammy;
      user.updatedBy = pieUserPayload.empNo;

      const result = await queryRunner.manager.update<User>(User, { id }, user);

      if (result.affected === 0) {
        return {
          ok: false,
          error: true,
          message: UnableToUpdateParticular(route),
          code: UnableToUpdateParticularCode
        };
      }

      await queryRunner.commitTransaction();

      await client.del(fetchAllUsers);

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

  async deleteUser({ id }, pieUserPayload) {
    const route = 'User';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.delete<User>(User, {
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

      await client.del(fetchAllUsers);

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
