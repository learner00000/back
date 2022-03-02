import Stock from '../models/stock.ts';


export type Params = NonNullable<ConstructorParameters<typeof URLSearchParams>[0]>;
// var stock = new Stock({});

class AlphaVantage { constructor (protected readonly api: AlaphaVantage) {} }

class Forex extends AlphaVantage {
  rate (from_currency: string, to_currency: string) {
    return this.api.query({
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency,
      to_currency,
    });
  }
}

class Stocks extends AlphaVantage {
    intraday (symbol: string , interval: string) {
      return this.api.query({
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
      });
    }
  }

export class AlaphaVantage {
  #token: string;

  constructor (token: string) {
    this.#token = token;
  }

  async query <Result = any>(params: Params): Promise<Result> {
    const url = new URL('https://www.alphavantage.co/query');

    const usp = new URLSearchParams(params);
    usp.set('apikey', this.#token);
    url.search = usp.toString();

    const request = new Request(url.href);
    const response = await fetch(request );

    if (!response.ok) throw new Error('Response not OK');

    return response.json();
  }

  forex = new Forex(this);
  stocks = new Stocks(this);
}

export const stockSave = async () => {
  const YOUR_API_KEY = 'ASLDVIWXGEWFWNZG';
  const alpha = new AlaphaVantage('ASLDVIWXGEWFWNZG');
  const writestock = await alpha.stocks.intraday('GOOG' , '1min' ).then((data: any) => {return data["Time Series (1min)"]["2022-02-28 14:31:00"]} );
  console.log('this is writestock' , writestock);
  const stock = new Stock({
   _id:  "",
   open:  writestock["1. open"],
   high:  writestock["2. high"],
   low: writestock["3. low"],
   close: writestock["4. close"],
   volume:  writestock["5. volume"]});
  await stock.save(stock);
}


// export const stockLoad = async () => {
//   console.log('preloaded stocj' , stock);
//   let loadedStock = await Stock.findOne({_id : stock._id });
//   console.log('this is loadedStock stock', loadedStock);
//   }
  
  // alpha.forex.rate('BTC', 'USD').then((data: any) => console.log(data));


// Use:

// const YOUR_API_KEY = 'demo';
// const alpha = new AlaphaVantage(YOUR_API_KEY);
// alpha.forex.rate('BTC', 'USD').then(data => console.log(data));

