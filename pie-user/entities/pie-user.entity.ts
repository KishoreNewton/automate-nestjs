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
import { PieUserRoleMapping } from '../../Pie User/entities/pieUser';
import { PieUserServiceAccess } from '../../Pie User/entities/pieUser';
import { PieUserApplicationAccess } from '../../Pie User/entities/pieUser';
import { PieUserGroup } from '../../Pie User/entities/pieUser';
import { PieUser } from '../../Pie User/entities/pieUser';

@Entity()
export class PieUser {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  Rafiale: string;

  @Index()
  @Column({ nullable: true, type: 'citext' })
  empNo: string;

  @Index()
  @Column()
  bobby: string;

  @Index()
  @Column()
  sammy: string;

  @OneToMany(
    () => PieUserRoleMapping,
    pieUserRoleMapping => pieUserRoleMapping.pieUser
  )
  pieUserRoleMapping: PieUserRoleMapping[];

  @OneToMany(
    () => PieUserServiceAccess,
    pieUserServiceAccess => pieUserServiceAccess.pieUser
  )
  pieUserServiceAccess: PieUserServiceAccess[];

  @OneToMany(
    () => PieUserApplicationAccess,
    pieUserApplicationAccess => pieUserApplicationAccess.pieUser
  )
  pieUserApplicationAccess: PieUserApplicationAccess[];

  @JoinColumn()
  @ManyToOne(() => PieUserGroup, pieUserGroup => pieUserGroup.pieUser, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
    nullable: false
  })
  pieUserGroup: PieUserGroup;

  @JoinColumn()
  @OneToOne(() => PieUser, pieUser => pieUser.pieUser, {
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
