// round.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

export enum RoundStatus {
  PLANNED = 'planned',
  IN_PROCESS = 'inProcess',
  FINISHED = 'finished',
}

@Entity('rounds')
export class Round {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.roundsAsPlayer1, { eager: true })
  player1: User;

  @ManyToOne(() => User, user => user.roundsAsPlayer2, { eager: true })
  player2: User;

  @Column({ type: 'enum', enum: RoundStatus, default: RoundStatus.PLANNED })
  status: RoundStatus;

  @Column({ type: 'int', default: 0 })
  player1Score: number;

  @Column({ type: 'int', default: 0 })
  player2Score: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  winner?: User; // user who won, null until finished

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
