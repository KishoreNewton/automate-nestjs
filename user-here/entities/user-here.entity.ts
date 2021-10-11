import { Entity, CreatedDateColumn, UpdatedDateColumn, Index, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserHere {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;
    
  @Index()
  @Column({ unique: true })
  empNo: string;
    
  @Index()
  @Column({ nullable: true, type: 'citext' })
  organizationEmailId: string;
    
  @Index()
  @Column()
  empStatus: string;
    
  @Index()
  @Column()
  mobileNumber: string;
    
  @OneToMany(() => PieUserRoleMapping, pieUserRoleMapping => pieUserRoleMapping.userHere)
  pieUserRoleMapping: PieUserRoleMapping[];
  
  @OneToMany(() => PieUserServiceAccess, pieUserServiceAccess => pieUserServiceAccess.userHere)
  pieUserServiceAccess: PieUserServiceAccess[];
  
  @OneToMany(() => PieUserApplicationAccess, pieUserApplicationAccess => pieUserApplicationAccess.userHere)
  pieUserApplicationAccess: PieUserApplicationAccess[];
  
  @JoinColumn()
  @ManyToOne(() => PieUserGroup, pieUserGroup => pieUserGroup.userHere, [object Object])
  pieUserGroup: PieUserGroup;
  
  @JoinColumn()
  @OneToOne(() => PieUser, pieUser => pieUser.userHere, [object Object])
  pieUser: PieUser;
  
  @Index()
  @CreatedDateColumn()
  createdOn: Date;

  @Index()
  @UpdatedDateColumn()
  updatedOn: Date;
}