import Ajv from 'ajv';

export function getSettingsDefaults() {
    return {
        speechSynthesis: true,
        autoSpeechSynthesis: false
    }
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