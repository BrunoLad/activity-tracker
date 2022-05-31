import { UpdateActivity } from "./update-activity";
import { UpdateActivityBuilder } from "./update-activity-builder"

describe('UpdateActivityBuilder', () => {
    it('should create an instance', () => {
        expect(new UpdateActivityBuilder()).toBeTruthy();
    });

    it('should return new Builder instance', () => {
        expect(UpdateActivityBuilder.init()).toBeInstanceOf(UpdateActivityBuilder);
    })

    it('should return new UpdateActivity instance', () => {
        expect(new UpdateActivityBuilder().build()).toBeInstanceOf(UpdateActivity);
    })
});