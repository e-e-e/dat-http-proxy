# dat-http-proxy

> A tool for replicating dats stored at static http/s web addresses.

Don’t know what a dat is? [Learn more here](https://datproject.org).

## Why

Dat is great, but at the moment it can become expensive if you are storing large datasets on a VPS. This tool helps you cheaply add redundancy to your peer to peer network, by enabling you to serve multiple readonly dat archives from static web hosts.

With this library you can setup one server with minimal storage and serve any number of large dats that are stored elsewhere.

**Note:** If you are only storing small dats - look at [Hashbase.io](https://hashbase.io). It is a great service which at the moment offers a free tier for dats up to 100MB.

## Install

To use as a cli utility

```
npm dat-http-proxy -g
```

or to use from within another project

```
npm dat-http-proxy --save
```

## Usage

### Command Line Interface

**To replicate a single url:**

```
dat-http-proxy [url]
```

**To manage multiple urls:**

To use as a cli you need to create a file called `url-feeds` containing a list of urls.

For example:
```
http://dats.metadada.xyz/openaustralia/senate_debates/
http://dats.metadada.xyz/openaustralia/representatives_debates/
http://dats.metadada.xyz/openaustralia/members/
```

Then simply run `dat-http-proxy` from the command line.
If you modify the `url-feeds` file, the `dat-http-proxy` process will update live adding or removing connections to the url.

**Note:** At the moment this application will fail hard if you pass a malformed url.

### Command Line Interface
