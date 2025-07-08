// user.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Round } from '../rounds/rounds.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string; // SHA‑256 hex string

  @Column({ type: 'varchar', length: 32, unique: true })
  username: string;

  @Column({ type: 'int', default: 0 })
  roundsWon: number;

  @Column({ type: 'int', default: 0 })
  roundsPlayed: number;

  @OneToMany(() => Round, r => r.player1)
  roundsAsPlayer1: Round[];

  @OneToMany(() => Round, r => r.player2)
  roundsAsPlayer2: Round[];
}