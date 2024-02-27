import { useState,useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Game {
    appid: number;
    playtime_forever: number;
    rtime_last_played: number;
}

interface GameResponse {
    response:{game_count: number;
    games: Game[];}
}

const steamGames = await fetch ("https://apui.vercel.app/api/steam_games").then((data)=>data.json()) as GameResponse;

const data=steamGames.response.games

const steam=data.sort((a,b) =>(b.playtime_forever)-(a.playtime_forever)
)

async function appidtosteamgamename(appid:number){
    return await fetch (`https://apui.vercel.app/api/steam_info?appid=${appid}`).then((data)=>data.json()) as {gameName:string};

}

const wallpaperengine = steam.map(function(e) { return e.appid; }).indexOf(431960);

steam.splice(wallpaperengine,1)

const mysteamgames = steam.slice(0,8)

const steamRecentGamesList = mysteamgames.map(
  async (game) => {
    return {
      name: (await appidtosteamgamename(game.appid)).gameName,
      playtime_forever: game.playtime_forever,
      game_image_url: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_600x900_2x.jpg`,
      rtime_last_played: game.rtime_last_played,
    };
  },
);

const steamRecentGames = await Promise.all(steamRecentGamesList);

export default function Steam(){
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return(
    <section>
    <Carousel className="w-full max-w-sm" setApi={setApi}>
        <CarouselContent className="-ml-1">
      
  {steamRecentGames.map((game,index) => (
<CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
    <div className="flex flex-col items-center">
    <img src={game.game_image_url} alt={game.name} className="rounded-lg w-300 h-450" width={600} height={900} />
    <p className="text-center">{game.name}</p>
    <p className="text-center">{Math.floor(game.playtime_forever / 60)} hours</p>
  </div>
    </CarouselItem>
  ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
</section>

  )
}