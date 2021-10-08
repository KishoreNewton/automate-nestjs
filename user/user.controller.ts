
@Injectable()
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async fetchAlluser() {
    return this.userService.fetchAlluser();
  }