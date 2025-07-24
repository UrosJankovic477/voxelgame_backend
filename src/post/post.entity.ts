import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('post')
export abstract class PostEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'post_uuid'
    })
    uuid: UUID;

    @Column({name: 'posted'})
    posted: Date;
    
    @Column({
        name: 'edited',
        nullable: true,
        type: 'date'
    })
    edited: Date | null;
}