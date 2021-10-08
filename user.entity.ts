
@Entity()
export class User {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;
    
  @Index()
  @Column({ unique: [33mtrue[39m })
  empNo: string;
    
  @Index()
  @Column({ nullable: [33mtrue[39m, type: [32m'citext'[39m })
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