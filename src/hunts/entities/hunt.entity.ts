import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  answer: string;
  // answer: {
  //   exact: boolean;
  //   type: 'text' | 'image';
  //   value: string;
  // };
  @Column()
  clue: string;
  @Column()
  description: string;
  @Column()
  latitude: number;
  @Column()
  longitude: number;
  @Column()
  name: string;
}
