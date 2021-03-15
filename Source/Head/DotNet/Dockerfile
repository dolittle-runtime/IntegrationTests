# DotNet Build
FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine AS dotnet-build
WORKDIR /app

COPY . ./

RUN dotnet restore Head.csproj
RUN dotnet publish Head.csproj -c DEBUG -o out

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:5.0 as base

ARG CONFIGURATION=Release

RUN echo Configuration = $CONFIGURATION

RUN apt-get update && \
    apt-get install -y --no-install-recommends unzip procps && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l ~/vsdbg

WORKDIR /app
COPY --from=dotnet-build /app//out ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "Head.dll"]