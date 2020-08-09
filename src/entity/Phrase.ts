import {Entity, PrimaryColumn, Column, Index} from "typeorm/index";

@Index(['userId', 'phrase'])
@Index(['userId', 'deleted'])
@Entity({
    name: 'phrases'
})
export class Phrase {
    @PrimaryColumn({
        type: 'uuid',
        default: () => 'uuid_generate_v4()'
    })
    id: string;

    @Column('text', {
        nullable: false
    })
    phrase: string

    @Column({
        default: () => `timezone('utc', now())`
    })
    createdAt: Date;

    @Column({
        default: false,
    })
    deleted: boolean

    @Column({
        nullable: true
    })
    deletedAt: Date

    @Column('uuid', {
        nullable: false
    })
    userId: string
}
