import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';
import { ValidateDtoPipe } from '../../pipes/validate.dto.pipe';
import {
  GetUsersQueryDto,
  IDeleteUserResponseDto,
  IUserResponseDto,
  UpdateUserRequestDto,
} from './user.dto';
import { matchAuthorizationWithId } from '../../utils/match.authorization.with.id';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}


  @Get(':id')
  getUser(@Param('id') id: string): Promise<IUserResponseDto> {
    return this.usersService.findUserByIdAsync(id);
  }

  @Get()
  @UsePipes(new ValidateDtoPipe())
  getUsers(
    @Query() queryDto: GetUsersQueryDto,
  ): Promise<IPaginatedResponse<IUserResponseDto[]>> {
    return this.usersService.getUsersPaginateAsync(
      queryDto.start,
      queryDto.limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<IDeleteUserResponseDto> {
    matchAuthorizationWithId(request, id);
    return this.usersService.deleteUserByIdAsync(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidateDtoPipe())
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto,
    @Req() request: Request,
  ): Promise<IUserResponseDto> {
    matchAuthorizationWithId(request, id);
    return this.usersService.updateUserAsync(id, dto);
  }
}
