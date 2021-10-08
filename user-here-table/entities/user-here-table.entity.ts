import { Entity, CreatedDateColumn, UpdatedDateColumn, Index, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserHereTable {
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
    
  @Index()
  @CreatedDateColumn()
  createdOn: Date;

  @Index()
  @UpdatedDateColumn()
  updatedOn: Date;
}