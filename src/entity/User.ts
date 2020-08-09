import {Entity, PrimaryColumn, Column, Unique} from "typeorm/index";

@Unique(['oauthId'])
@Entity({
    name: 'users'
})
export class User {
    @PrimaryColumn({
        type: 'uuid',
        default: () => 'uuid_generate_v4()'
    })
    id: string;


    @Column('text', {
        nullable: false
    })
    oauthId: string;

    @Column('text')
    displayName: string;

    @Column('text')
    profileImage: string;

    @Column({
        default: () => "timezone('utc', now())",
    })
    createdAt: Date;

    @Column({
        length: 20,
        nullable: false
    })
    oauthProvider: string;

    @Column('text')
    raw: string;
}
