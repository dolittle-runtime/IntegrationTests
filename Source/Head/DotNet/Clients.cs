// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Dolittle.SDK;
using Dolittle.SDK.EventHorizon;
using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Filters;
using Dolittle.SDK.Microservices;
using Dolittle.SDK.Tenancy;
using Microsoft.Extensions.Logging;

namespace Head
{
    public record ClientId(MicroserviceId Microservice, string RuntimeHost, ushort RuntimePort);

    public class ClientWrapper : IDisposable
    {
        readonly CancellationTokenSource _cts;
        readonly ILoggerFactory _loggerFactory;
        bool _disposed;

        public ClientWrapper(ClientId id, ILoggerFactory loggerFactory)
        {
            Id = id;
            _loggerFactory = loggerFactory;
            _cts = new CancellationTokenSource();
            DolittleClient = BuildClient();
        }

        public ClientId Id { get; }
        public Client DolittleClient { get; }

        public Task Start() => DolittleClient.Start();

        public void Stop() => _cts.Cancel();

        public void SubscribeToEventHorizon(
            TenantId consumerTenant,
            MicroserviceId producerMicroservice,
            TenantId producerTenant,
            StreamId producerStream,
            PartitionId producerPartition,
            ScopeId consumerScope)
            => DolittleClient.EventHorizons.Subscribe(new Subscription(
                consumerTenant,
                producerMicroservice,
                producerTenant,
                producerStream,
                producerPartition,
                consumerScope));

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            if (!_cts.IsCancellationRequested) _cts.Cancel();
            if (disposing)
            {
                _cts.Dispose();
            }
            _disposed = true;
        }

        ~ClientWrapper()
        {
            Dispose(false);
        }

        Client BuildClient()
            => Client
                .ForMicroservice(Id.Microservice)
                .WithCancellation(_cts.Token)
                .WithRuntimeOn(Id.RuntimeHost, Id.RuntimePort)
                .WithEventTypes(_ => _.RegisterAllFrom(typeof(Event).Assembly))
                .WithEventHandlers(_ => _.RegisterAllFrom(typeof(MyEventHandler).Assembly))
                .WithFilters(_ =>
                    _.CreatePublicFilter("82f35eaa-8317-4c8b-9bd6-f16c212fda96", _ =>
                    {
                        var logger = _loggerFactory.CreateLogger("PublicFilter");
                        _.Handle((evt, ctx) =>
                        {
                            logger.LogInformation("Filtering public event");
                            return Task.FromResult(new PartitionedFilterResult(true, Guid.Empty));
                        });
                    }))
                .Build();
    }
    public interface IClients
    {
        bool TryAddAndStart(ClientId id);
        bool RemoveAndStop(ClientId id);
        bool TryGetDolittleClient(ClientId id, out Client client);
    }
    public class Clients : IClients
    {
        readonly ILoggerFactory _loggerFactory;
        readonly Dictionary<ClientId, ClientWrapper> _clients = new ();

        public Clients(ILoggerFactory loggerFactory) => _loggerFactory = loggerFactory;

        public bool TryAddAndStart(ClientId id)
        {
            if (_clients.ContainsKey(id)) return false;
            var client = new ClientWrapper(id, _loggerFactory);
            _clients.Add(id, client);
            client.Start();
            return true;
        }
        public bool RemoveAndStop(ClientId id)
        {
            _clients.TryGetValue(id, out var client);
            client.Dispose();
            return _clients.Remove(id);
        }

        public bool TryGetDolittleClient(ClientId id, out Client client)
        {
            client = null;
            if (_clients.TryGetValue(id, out var clientWrapper))
            {
                client = clientWrapper.DolittleClient;
                return true;
            }
            return false;
        }
    }
}
