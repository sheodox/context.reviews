import {Entity, PrimaryColumn, Column, Unique, OneToOne} from "typeorm/index";
import {Settings} from "./Settings";

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

    @OneToOne(() => Settings, settings => settings.user)
    settings: Settings
}
