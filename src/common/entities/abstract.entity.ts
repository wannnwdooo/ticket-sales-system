import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt!: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamptz' })
  public deletedAt!: Date;
}
