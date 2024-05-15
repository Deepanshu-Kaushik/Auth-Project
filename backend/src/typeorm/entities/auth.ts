import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { Application } from './application';

@Entity({ name: 'token' })
export class Auth {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: false })
  userId: number;

  @Column()
  appId: number;

  @ManyToOne(() => Application, (app) => app.tokens)
  app: Application;

  @ManyToOne(() => User, (user) => user.tokeninfo) //, {onDelete:'CASCADE'} add later @JoinColumn() add later  
  user: User;

  @Column()
  token: string;

  @Column()
  exp: number;

  @Column()
  iat: Date;

  @Column({ nullable: true })
  jwt: string;
}
