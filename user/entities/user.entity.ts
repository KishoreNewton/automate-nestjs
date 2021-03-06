import {
  Entity,
  CreatedDateColumn,
  UpdatedDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Index,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { PieUserRoleMapping } from '../../User/entities/pieUser';
import { PieUserServiceAccess } from '../../User/entities/pieUser';
import { PieUserApplicationAccess } from '../../User/entities/pieUser';
import { PieUserGroup } from '../../User/entities/pieUser';
import { PieUser } from '../../User/entities/pieUser';

@Entity()
export class User {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  dean: string;

  @Index()
  @Column({ nullable: true, type: 'citext' })
  cass: string;

  @Index()
  @Column()
  bobby: string;

  @Index()
  @Column()
  sammy: string;

  @OneToMany(
    () => PieUserRoleMapping,
    pieUserRoleMapping => pieUserRoleMapping.user
  )
  pieUserRoleMapping: PieUserRoleMapping[];

  @OneToMany(
    () => PieUserServiceAccess,
    pieUserServiceAccess => pieUserServiceAccess.user
  )
  pieUserServiceAccess: PieUserServiceAccess[];

  @OneToMany(
    () => PieUserApplicationAccess,
    pieUserApplicationAccess => pieUserApplicationAccess.user
  )
  pieUserApplicationAccess: PieUserApplicationAccess[];

  @JoinColumn()
  @ManyToOne(() => PieUserGroup, pieUserGroup => pieUserGroup.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: false
  })
  pieUserGroup: PieUserGroup;

  @JoinColumn()
  @OneToOne(() => PieUser, pieUser => pieUser.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: false
  })
  pieUser: PieUser;

  @Index()
  @Column()
  createdBy: string;

  @Index()
  @Column()
  updatedBy: string;

  @Index()
  @CreatedDateColumn()
  createdOn: Date;

  @Index()
  @UpdatedDateColumn()
  updatedOn: Date;
}
