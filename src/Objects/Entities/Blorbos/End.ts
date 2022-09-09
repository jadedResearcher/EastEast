import { Movement } from "../../MovementAlgs/BaseMovement";
import { NoMovement } from "../../MovementAlgs/NoMovement";
import { Room } from "../../RoomEngine/Room";
import { all_themes } from "../../Theme";
import { ENDINGS, KILLING, QUESTING, LONELY } from "../../ThemeStorage";
import { DeploySass } from "../Actions/DeploySass";
import { FollowObject } from "../Actions/FollowObject";
import { MeleeKill } from "../Actions/MeleeKill";
import { AiBeat } from "../StoryBeats/BaseBeat";
import { TARGETSTRING } from "../TargetFilter/baseFilter";
import { RandomTarget } from "../TargetFilter/RandomTarget";
import { TargetIsAlive } from "../TargetFilter/TargetIsAlive";
import { TargetIsBlorboOrBox } from "../TargetFilter/TargetIsBlorboBox";
import { TargetIsWithinRadiusOfSelf } from "../TargetFilter/TargetIsWithinRadiusOfSelf";
import { Quotidian, Direction } from "./Quotidian";



export class Camille extends Quotidian{
    lore = "Parker has said her soul has the shape of an Irish Wolfound.  Something friendly and big that does not understand why you find it intimidating. It thinks it is a lapdog, it just wants to be friends. Unless you are for killing. Then you are dead. Very, very, quickly dead.";

    maxSpeed = 50;
    minSpeed = 5;
    currentSpeed = 5;

    direction = Direction.UP; //movement algorithm can change or use this.
    movement_alg:Movement = new NoMovement(this);

    constructor(room: Room, x: number, y:number){
        const sprite = {
            default_src:{src:"the_end2.png",width:56,height:100},

        };
        const start = "<span class='asl'>"
        const end = "</span>"

         const BreathOnObject = new AiBeat(
            "Camille: Be Friends",
            [`Camille looms over ${TARGETSTRING}. She says '${start}Where are we going?${end}'.`,`Camille looms over ${TARGETSTRING}. She says '${start}Hello!${end}'.`,`Camille looms over ${TARGETSTRING}. She says ':3'.`,`Camille looms over ${TARGETSTRING}. She says '${start}Friend!${end}'.`],
            [new TargetIsBlorboOrBox(),new TargetIsAlive(), new TargetIsWithinRadiusOfSelf(5, {singleTarget:true})],
            [new DeploySass(":)")],
            true,
            2*60*1000
        );

        //she doesn't tend to change her mind
        const ObesssOverBlorbo = new AiBeat(
            "Camille: Make Friends",
            [`Camille locks eyes with ${TARGETSTRING}.`],
            [new TargetIsBlorboOrBox(), new TargetIsAlive(),new RandomTarget(.5, {singleTarget:true})],
            [new FollowObject()]
        );
        const beats:AiBeat[] = [ObesssOverBlorbo,BreathOnObject];
        const states = [new End(room,0,0)];

        super(room,"Camille", x,y,[all_themes[ENDINGS],all_themes[KILLING],all_themes[QUESTING],all_themes[LONELY]],sprite,"The End Comes For Us All", beats, states);
    }

    die = (causeOfDeath: string) => {
        console.warn(`JR NOTE: whoops. Looks like Camille...lost her head! 🥁 `);
        this.incrementState();
        this.breaching  = true;
    }
}


export class End extends Quotidian{
    lore = "Parker has said her soul has the shape of an Irish Wolfound.  Something friendly and big that does not understand why you find it intimidating. It thinks it is a lapdog, it just wants to be friends. Unless you are for killing. Then you are dead. Very, very, quickly dead.";

    maxSpeed = 50;
    minSpeed = 5;
    currentSpeed = 5;

    direction = Direction.UP; //movement algorithm can change or use this.
    movement_alg:Movement = new NoMovement(this);

    constructor(room: Room, x: number, y:number){
        const sprite = {
            default_src:{src:"theend.png",width:56,height:100},

        };

         const KillObject = new AiBeat(
            "End: End Them",
            [`The time has come. It was always going to end this way. All who are born die. ${TARGETSTRING} meets their end with one clean cut.`],
            [new TargetIsBlorboOrBox(),new TargetIsAlive(), new TargetIsWithinRadiusOfSelf(5, {singleTarget:true})],
            [new MeleeKill("being alive")],
            true,
            2*60*1000
        );

        //she doesn't tend to change her mind
        const ObesssOverBlorbo = new AiBeat(
            "End: Pick Target",
            [`The shambling corpse of a long dead warrior begins calmly walking towards ${TARGETSTRING}.`],
            [new TargetIsBlorboOrBox(), new TargetIsAlive(),new RandomTarget(.5, {singleTarget:true})],
            [new FollowObject()]
        );
        const beats:AiBeat[] = [ObesssOverBlorbo,KillObject];
        super(room,"End", x,y,[all_themes[ENDINGS],all_themes[KILLING],all_themes[QUESTING],all_themes[LONELY]],sprite,"The End Comes For Us All", beats);
    }

    die = (causeOfDeath: string) => {
        console.warn(`JR NOTE: did you actually think Death could die? That the Coffin Spawn itself could end???`);
    }
}
