/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UpdateTodoDto {
  /** @format int64 */
  id: number;
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  description?: string;
  status: 'TODO' | 'DONE';
}

export interface TodoResponse {
  /** @format int64 */
  id: number;
  name: string;
  description?: string;
  creator: UserResponse;
  /** @format date-time */
  createdAt: string;
  status: 'TODO' | 'DONE';
}

export interface UserResponse {
  /** @format int64 */
  id: number;
  name: string;
}

export interface RefreshJwtWithSessionTokenDto {
  refreshToken: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface CreateTodoDto {
  /**
   * @minLength 2
   * @maxLength 50
   */
  name: string;
  description?: string;
}
