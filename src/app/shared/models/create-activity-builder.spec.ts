import { CreateActivity } from "./create-activity";
import { CreateActivityBuilder } from "./create-activity-builder"

describe('ActivityBuilder', () => {
    it('should create an instance', () => {
        expect(new CreateActivityBuilder()).toBeTruthy();
    });

    it('should return new Builder instance', () => {
        expect(CreateActivityBuilder.init()).toBeInstanceOf(CreateActivityBuilder);
    });

    it('should return new CreateActivity instance', () => {
        expect(new CreateActivityBuilder().build()).toBeInstanceOf(CreateActivity);
    });

    it(`should return new Activity instance with correct final
        date base on duration value`, () => {
            const builder = CreateActivityBuilder.init();
            const activity = builder.withDuration('10:00').build();
            const date = new Date();
            date.setHours(date.getHours() + 10);

            expect(activity).toBeInstanceOf(CreateActivity);
            // Error margin of absolute difference of 1s between dates
            expect(Math.abs(activity.duration!.getTime() - date.getTime())).toBeLessThanOrEqual(1000);
    });

    describe('setFileName', () => {
        it('should set fileName correctly', () => {
            const builder = CreateActivityBuilder.init();
            const activity = builder.setFileName('file').build();
    
            expect(activity).toBeInstanceOf(CreateActivity);
            expect(activity.fileName).toMatch(/\d{4}-\d{2}-\d{2}-\d{2}_\d{2}_\d{2}-file/)
        });
    });
});
