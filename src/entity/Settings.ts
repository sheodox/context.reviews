import {Entity, PrimaryColumn, Column, Unique, OneToOne, JoinColumn} from "typeorm/index";
import {User} from "./User";
import Ajv from 'ajv';

@Entity({
    name: 'settings'
})
export class Settings {
    @PrimaryColumn({
        type: 'uuid',
        default: () => 'uuid_generate_v4()'
    })
    id: string;

    @Column()
    speechSynthesis: boolean;

    @Column()
    autoSpeechSynthesis: boolean;

    @OneToOne(() => User, user => user.settings)
    @JoinColumn()
    user: User;
}

export const getSettingsDefaults = () => {
    const settings = new Settings();
    Object.assign(settings, {
        speechSynthesis: true,
        autoSpeechSynthesis: false
    });
    return settings;
}

const ajv = new Ajv();
export const validateSettingsSchema = ajv.compile({
    type: 'object',
    properties: {
        //explicitly not validating 'id', this should only accept changes to patchable fields
        speechSynthesis: {
            type: 'boolean'
        },
        autoSpeechSynthesis: {
            type: 'boolean'
        }
    },
    additionalProperties: false
})
