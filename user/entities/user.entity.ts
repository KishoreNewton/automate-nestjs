
@Entity()
export class User {
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