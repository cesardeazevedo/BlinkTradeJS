declare let BlinkTradeWS: blinktrade.WS
declare let BlinkTradeRest: blinktrade.Rest

/**
 * BlinkTradeJS SDK
 */
declare module blinktrade {

    /**
     * BlinkTrade Base Object
     */
    interface BlinkTradeBase {

        /**
         * Custom url just in case if you're using a custom backend url.
         */
        url?: string;

        /**
         * Production environment, default to false.
         */
        prod?: boolean;

        /**
         * Broker ID.
         */
        brokerId?: number;
    }

    interface BlinkTradeWS extends BlinkTradeBase {

      /**
       * Custom headers to pass to websocket constructor
       */
      headers?: Object;
      /**
       * Custom fingerprint
       */
      fingerPrint?: String;
    }

    /**
     *
     */
    interface BlinkTradeRest extends BlinkTradeBase {
        /**
         * API Key generated on our platform, it only needed on the Trade endpoint.
         */
        key: string;

        /**
         * API Secret generated on our platform, it only needed on the Trade endpoint.
         */
        secret: string;

        /**
         * Currency symbol to fetch public endpoint.
         */
        currency?: 'USD' | 'BRL' | 'CLP' | 'VND';
    }

    /**
     * Login data
     */
    interface Login {

        /**
         * Account username or an API Key
         */
        username: string;

        /**
         * Password or an API Password
         */
        password: string;

        /**
         * Optional secondFactor, if the authentication require second factor, you'll receive an error with NeedSecondFactor = true
         */
        secondFactor?: string;

        /**
         * Cancel all orders sent by the session when the websocket disconnects
         */
        cancelOnDisconnect?: boolean;

        /**
         * Optional brokerId
         */
        brokerId?: number;
    }

    /**
     * Pagination to fetch
     */
    interface Pagination {
        page?: number;
        pageSize?: number;
    }

    /**
     * Order data
     */
    interface Order {
        /**
         * "1" = Buy, "2" = Sell
         */
        side: 'BUY' | 'SELL' | '1' | '2';

        /**
         * Order type, defaults to LIMIT
         */
        type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';

        /**
         * Price in "satoshis". e.g.: 1800 * 1e8
         */
        price?: number;

        /**
         * Stop price
         */
        stopPrice?: number,

        /**
         * Amount to be sent in satoshis. e.g.: 0.5 * 1e8
         */
        amount: number;

        /**
         * Currency pair symbol, check symbols table
         */
        symbol: string;

        /**
         * Optional Client ID
         */
        clientId?: string;

        /**
         * If true, ensures that your order will be added to the order book and not match with a existing order
         */
        postOnly?: boolean;
    }

    /**
     *
     */
    interface OrderClient {
        /**
         * Required Order ID to be canceled
         */
        orderId?: number;

        /**
         * You need to pass the clientId (ClOrdID) in order to get a response
         */
        clientId?: string;
    }

    type WithdrawStatus = '1' | '2' | '4' | '8';

    interface MyOrdersList extends Pagination {
      /**
       * All:              empty
       * Open Orders:      filter: ["has_leaves_qty eq 1"]
       * Filled Orders:    filter: ["has_cum_qty eq 1"]
       * Cancelled Orders: filter: ["has_cxl_qty eq 1"]
       */
      filter?: Array<string>
    }

    /**
     * Returns all your withdraws.
     */
    interface DepositWithdrawList extends Pagination {
        /**
         * 1-Pending, 2-In Progress, 4-Completed, 8-Cancelled
         */
        statusList: Array<WithdrawStatus>;
    }

    /**
     * Returns ledger
     */
    interface LedgerList extends Pagination {
        /**
         * Currency Symbol, e.g.: 'USD' | 'BRL' | 'VEF' | 'CLP' | 'VND' | 'PKR';
         */
        currency: string;
    }

    /**
     * The `data` object represents the information to your withdraw, it's related to bank accounts, numbers,
     * or a bitcoin address, these informations are dynamically and is diferrent from brokers by brokers,
     * can check the withdraws methods required fields on API section.
     */
    interface Withdraw {
        /**
         * Withdraw required fields
         */
        data: Object;

        /**
         * Amount of the withdraw
         */
        amount: number;

        /**
         * Method name of withdraw, check with your broker, defaults to bitcoin
         */
        method?: string;

        /**
         * Currency pair symbol to withdraw, defaults to `BTC`
         */
        currency?: string;
    }

    interface ConfirmWithdraw {
      /**
       * Withdraw ID to confirm
       */
      withdrawId: string;

      /**
       * Confirmation Token sent by email
       */
      confirmationToken?: string;

      /**
       * Second Factor Authentication code generated by authy
       */
      secondFactor?: string;
    }

    /**
     *
     */
    interface Deposit {
        /**
         * Value amount to deposit
         */
        value?: number;

        /**
         * Currency pair symbol to withdraw, defaults to `BTC`
         */
        currency?: string;

        /**
         * Method ID to deposit, check `requestDepositMethods`
         */
        depositMethodId?: number;
    }

    interface Trades {
        /**
         * Limit of trades that will be returned. should be a positive integer. Optional; defaults to 1000 trades.
         */
        limit?: number;

        /**
         * TradeID which must be fetched from. Optional;
         */
        since?: number;
    }

    interface TradeHistory extends Pagination {
        /**
         * TradeID or Date which executed trades must be fetched from. is in Unix Time date format. Optional; defaults to the date of the first executed trade.
         */
        since?: number;

        /**
         * List os symbols to be returned
         */
        symbols?: Array<string>;
    }

    interface Ledger extends Pagination {
        /**
         * Currency available on the current broker e.g.: `BTC`, `BRL`, `PKR`, `CLP`.
         * Only one currency is supported on the request.
         */
        currency: string;

        /**
         * *DEPRECATED* Generic filter
         */
        filter: Array<string>;
    }

    /**
     *
     */
    interface BaseTransport {

        /**
         * Request balance.
         *
         * @Events: `BALANCE`
         */
        balance(clientId?: string, callback?: Function): Promise<Object>;

        /**
         * Returns your open orders
         */
        myOrders(param?: MyOrdersList, callback?: Function): Promise<Object>;

        /**
         * Send an order
         */
        sendOrder(order: Order, callback?: Function): Promise<Object>;

        /**
         * Cancel an order
         */
        cancelOrder(param?: number | OrderClient, callback?: Function): Promise<Object>;

        /**
         * Returns a list of your withdraws
         */
        requestWithdrawList(params: DepositWithdrawList, callback?: Function): Promise<Object>;

        /**
         * Request a FIAT or bitcoin withdraw
         */
        requestWithdraw(params: Withdraw, callback?: Function): Promise<Object>;

        /**
         * Confirm withdraw to two factor authentication
         */
        confirmWithdraw(params: ConfirmWithdraw, callback?: Function): Promise<Object>;

        /**
         * Cancel withdraw
         */
        cancelWithdraw(withdrawId: number, callback?: Function): Promise<Object>;

        /**
         * Returns a list of your deposits
         */
        requestDepositList(params: DepositWithdrawList, callback?: Function): Promise<Object>;

        /**
         *  If any arguments was provied, it will generate a bitcoin deposit along with the address.
         */
        requestDeposit(params: Deposit, callback?: Function): Promise<Object>;

        /**
         * Used to check the deposit methods codes to FIAT deposit
         */
        requestDepositMethods(callback?: Function): Promise<Object>;

        /**
         * Request Ledger
         */
        requestLedger(params?: Ledger, callback?: Function): Promise<Object>;
    }

    /**
     *
     */
    interface WebSocketTransport extends BaseTransport {
        /**
         * Connect to our websocket.
         */
        connect(callback?: Function): Promise<any>;
    }

    /**
     *
     */
    interface WS extends WebSocketTransport {
        /**
         * WebSocket Transport constructor
         */
        new(param?: BlinkTradeBase): WS;

        /**
         * WebSocket authentication
         */
        login(params: Login, callback?: Function): Promise<Object>;

        /**
         * Logout session from the server, the connection still connected.
         */
        logout(callback?: Function): Promise<Object>;

        /**
         * Used as test request to check the latency connection.
         */
        heartbeat(callback?: Function): Promise<Object>;

        /**
         * Returns profile information
         */
        profile(callback?: Function): Promise<Object>;

        /**
         * @Events: Any symbol subscribed
         */
        subscribeTicker(symbols: Array<string>, callback?: Function): Promise<Object>;

        /**
         * Unsubscribe ticker
         */
        unSubscribeTicker(SecurityStatusReqID: number): number;

        /**
         * Subscribe to orderbook
         */
        subscribeOrderbook(symbols: Array<string>, callback?: Function): Promise<Object>;

        /**
         * Unsubscribe from orderbook
         */
        unSubscribeOrderbook(MDReqID: number): number;

        /**
         * @Events:
         * `EXECUTION_REPORT:NEW`       => Callback when you send a new order
         * `EXECUTION_REPORT:PARTIAL`   => Callback when your order have been partialy executed
         * `EXECUTION_REPORT:EXECUTION` => Callback when an order have been sussefully executed
         * `EXECUTION_REPORT:CANCELED`  => Callback when your order have been canceled
         * `EXECUTION_REPORT:REJECTED`  => Callback when your order have been rejected
         */
        executionReport(callback?: Function): Promise<Object>;

        /**
         * A list of the last trades executed in the last 24 hours.
         */
        tradeHistory(params?: TradeHistory, callback?: Function): Promise<Object>;

        /**
         * Callbacks on each deposit update, note that using as promise will only returned once.
         */
        onDepositRefresh(callback?: Function): Promise<Object>

        /**
         * Callbacks on each withdraw update, note that using as promise will only returned once.
         */
        onWithdrawRefresh(callback?: Function): Promise<Object>
    }

    /**
     *
     */
    interface Rest {
        /**
         * Rest Transport Constructor
         */
        new(param: BlinkTradeRest): Rest;

        /**
         * Ticker is a summary information about the current status of an exchange.
         */
        ticker(callback?: Function): Promise<Object>;

        /**
         * A list of the last trades executed on an exchange since a chosen date.
         */
        trades(trades: Trades, callback?: Function): Promise<Object>;

        /**
         * Order book is a list of orders that shows the interest of buyers (bids) and sellers (asks).
         */
        orderbook(callback?: Function): Promise<Object>;
    }

    interface Promise<T> extends EventEmitter<T> {
        then(onFulfilled:(response?: T) => any, onRejected?:(response: any) => any): Promise<any>;
        catch(onRejected:(response?: any) => any): Promise<any>;
    }

    interface Listener{
        (...values: any[]): void;
    }

    interface EventAndListener {
        (event: string,...values: any[]): void;
    }

    /**
     * EventEmitter2 Instance
     */
    interface EventEmitter<T> {
        /**
         * Adds a listener to the end of the listeners array for the specified event.
         */
        on(event: string, listener: Listener): Promise<T>;

        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the callback.
         */
        onAny(listener: EventAndListener): Promise<T>;

        /**
         * Removes the listener that will be fired when any event is emitted.
         */
        offAny(listener: Listener): Promise<T>;

        /**
         * Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
         */
        once(event: string, listener: Listener): Promise<T>;

        /**
         * Adds a listener that will execute n times for the event before being removed. The listener is invoked only the first n times the event is fired, after which it is removed.
         */
        many(event: string, timesToListen: number, listener: Listener): Promise<T>;

        /**
         * Adds a listener that will execute n times for the event before being removed. The listener is invoked only the first n times the event is fired, after which it is removed.
         */
        many(events: string[], listener: Listener): Promise<T>;

        /**
         * Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
         */
        removeListener(event: string, listener: Listener): Promise<T>;

        /**
         * Removes all listeners, or those of the specified event
         */
        removeAllListeners(events?: string[]): Promise<T>;
    }
}

export {
    BlinkTradeWS,
    BlinkTradeRest,
}
