import { Column, PrimaryGeneratedColumn, OneToOne, Entity } from 'typeorm';
import { HuntStep } from 'src/hunts/entities/hunt-step.entity';

@Entity()
export class HuntStepAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  exact: boolean;

  @Column()
  type: 'text' | 'image';

  @Column()
  value: string;

  @OneToOne(() => HuntStep, (huntStep) => huntStep.answer)
  huntStep: HuntStep;
}
