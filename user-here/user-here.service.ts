
import { BadRequestException, InternalServerErrorException, Injectable  } from '@nestjs/common';
import { fetchAllUserHeres } from './constants/cache.constant';
import { getConnection  } from 'typeorm';
import { CoreOutput  } from 'sm-interfaces';
import { UserHere } from './entities/user-here.entity';
import { client  } from '../main';
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
export class UserHereService {
  constructor() {}

  async fetchAllUserHere () {
    try {
      const cache = await client.get(fetchAllUserHeres);
      if (cache) return JSON.parse(cache);
    } catch (error) {
      await client.del(fetchAllUserHeres);
    }

    const route = 'User Here';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const result = await queryRunner.manager.find<UserHere>(
        UserHere
      );

      await client.set(fetchAllUserHeres, JSON.stringify(result));

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        ok: false,
        error: true,
        message: SomethingWentWrong,
        code: SomethingWentWrongCode
      })
    } finally {
      await queryRunner.release();
    }
  }

  async createUserHere (
    { empNo, organizationEmailId, empStatus, mobileNumber  },
    pieUserPayload
  ): Promise<CoreOutput> {
    const route = 'User Here';
    const connection = getConnection(); 
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userHere = new UserHere();
      
      userHere.empNo = empNo;
      userHere.organizationEmailId = organizationEmailId;
      userHere.empStatus = empStatus;
      userHere.mobileNumber = mobileNumber;

      const result = await queryRunner.manager.save<UserHere>(userHere);
      
      if (!result) {
        return {
          ok: false,
          error: true,
          message: UnableToCreate(route),
          code: UnableToCreateCode
        };
      }

      await client.del(fetchAllUserHeres);
  
      return {
        ok: true,
        error: false,
        message: CreateSuccessful(route)
      }
    
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

  async updateUserHere (
    { id, empNo, organizationEmailId, empStatus, mobileNumber  },
    pieUserPayload
  ) {
    const route = 'User Here';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userHere = new UserHere();
      
      userHere.id = id;
      if (empNo)  userHere.empNo = empNo;
      if (organizationEmailId)  userHere.organizationEmailId = organizationEmailId;
      if (empStatus) userHere.empStatus = empStatus
      if (mobileNumber)  userHere.mobileNumber = mobileNumber;

      const result = await queryRunner.manager.update<UserHere>(
        UserHere,
        { id  },
        userHere
      )

      if (result.affected === 0) {
        return {
          ok: false,
          error: true,
          message: UnableToUpdateParticular(route),
          code: UnableToUpdateParticularCode
        };
      }

      await queryRunner.commitTransaction();

      await client.del(fetchAllUserHeres);

      return {
        ok: true,
        error: false,
        message: UpdateSuccessful(route)
      }

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