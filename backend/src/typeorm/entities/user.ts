import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application';
import { Auth } from './auth';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  admin: string;

  @Column({ nullable: true })
  twofa: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  passotp: string;

  @Column()
  passexp: string;

  @OneToMany(() => Application, (app) => app.user)
  apps: Application[];

  @OneToMany(() => Auth, (token) => token.user)
  tokeninfo: Auth[];
}
