import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { Auth } from './auth';

@Entity({ name: 'application' })
export class Application {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  homepage_url: string;

  @Column()
  callback_url: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  client_id: string;

  @Column()
  client_secret: string;

  @Column()
  scope: string;

  @ManyToOne(() => User, (user) => user.apps, { onDelete: 'SET NULL' })
  user: User;

  @OneToMany(() => Auth, token => token.app)
  tokens: Auth[];
}
