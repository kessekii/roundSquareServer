// user.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Round } from '../rounds/rounds.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string; // SHA‑256 hex string

  @Column({ type: 'varchar', length: 32, unique: true })
  username: string;

    @Column({ type: 'varchar', length: 64, nullable: true })
    password: string;

}