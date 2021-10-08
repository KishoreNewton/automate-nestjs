
@Injectable()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async fetchAllUser() {
    return this.userService.fetchAllUser();
  }