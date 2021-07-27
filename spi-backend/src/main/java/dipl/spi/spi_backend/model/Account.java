package dipl.spi.spi_backend.model;

import dipl.spi.spi_backend.dto.AccountDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String recipientName;

    @Column(nullable = false)
    private String recipientAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    private AppUser creator;


    public void updateValues(AccountDto accountDto) {
        this.recipientName = accountDto.getRecipientName();
        this.recipientAddress = accountDto.getRecipientAddress();
    }

}
