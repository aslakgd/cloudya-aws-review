# Cloudya AWS Economics Review

Delbar prototype av en landingsside for AWS Economics Review. Siden følger Cloudyas designspråk og viser formatet på en side beslutningsstøtte.

Flyt: månedlig AWS-forbruk, Savings Plans, jobb-e-post og selskap. Kontaktinfo sendes ikke til Cloudya eller andre tjenester. Skjemaet og neste skjerm er tydelig merket som forhåndsvisning.

## Lokal visning

Start en server fra denne mappen:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Åpne http://127.0.0.1:8766/.

## Filer

- `index.html`: sidestruktur, metadata og prototypemerking.
- `style.css`: Cloudyas visuelle stil og mobilvisning.
- `review-flow.js`: spørsmål, kontaktskjema, validering og forhåndsvisning.
- `assets/`: Cloudya-logo og Inter-font fra cloudya.no.

## GitHub Pages

Publiser `main` fra rotmappen via Settings → Pages → Deploy from a branch. `.nojekyll` lar GitHub publisere de statiske filene direkte.

## Før reell leadinnsamling

Et eget HubSpot-skjema eller annen mottaker må opprettes og kobles til. Feltmapping, personverntekst og faktisk kontaktmottak må testes. Vis mottaksbekreftelse først etter godtatt innsending. Fjern prototypemerkingen når siden er klar for reell bruk. Det er ikke satt opp automatisk e-postutsending.

Cloudyas omfang og kapasitet for tilbudet må bekreftes før det brukes i annonser.
