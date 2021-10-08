
@Entity()
export class User {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;
    
  @Index()
  @Column()
  empNo: string;
    
  @Index()
  @Column()
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